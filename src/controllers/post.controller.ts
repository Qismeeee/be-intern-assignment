import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { Hashtag } from '../entities/Hashtag';
import { User } from '../entities/User';

export class PostController {
  private postRepository = AppDataSource.getRepository(Post);
  private hashtagRepository = AppDataSource.getRepository(Hashtag);
  private userRepository = AppDataSource.getRepository(User);

  async createPost(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const user = req.user!;
      const hashtagRegex = /#(\w+)/g;
      const hashtagMatches = [...content.matchAll(hashtagRegex)];
      const hashtagNames = hashtagMatches.map(match => match[1].toLowerCase());
      
      const post = this.postRepository.create({
        content,
        user,
        userId: user.id,
        hashtags: []
      });

      if (hashtagNames.length > 0) {
        for (const name of hashtagNames) {
          let hashtag = await this.hashtagRepository.findOneBy({ name });
          
          if (!hashtag) {
            hashtag = this.hashtagRepository.create({ name });
            await this.hashtagRepository.save(hashtag);
          }
          
          post.hashtags = [...(post.hashtags || []), hashtag];
        }
      }

      await this.postRepository.save(post);

      res.status(201).json({
        message: 'Post created successfully',
        post
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .orderBy('post.createdAt', 'DESC')
        .getMany();
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  }

  async getPostsByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);      
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .where('post.userId = :userId', { userId })
        .orderBy('post.createdAt', 'DESC')
        .getMany();
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user posts', error });
    }
  }

  async getPostsByHashtag(req: Request, res: Response) {
    try {
      const hashtag = req.params.hashtag;
      
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.hashtags', 'hashtag', 'hashtag.name = :hashtag', { hashtag })
        .innerJoinAndSelect('post.user', 'user')
        .orderBy('post.createdAt', 'DESC')
        .getMany();
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts by hashtag', error });
    }
  }

  async likePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user!;

      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['likedBy']
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const alreadyLiked = post.likedBy.some(likedUser => likedUser.id === user.id);
      
      if (alreadyLiked) {
        return res.status(400).json({ message: 'Post already liked' });
      }

      post.likedBy.push(user);
      await this.postRepository.save(post);

      res.json({ message: 'Post liked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error liking post', error });
    }
  }

  async unlikePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user!;

      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['likedBy']
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const alreadyLiked = post.likedBy.some(likedUser => likedUser.id === user.id);
      
      if (!alreadyLiked) {
        return res.status(400).json({ message: 'Post not liked yet' });
      }

      post.likedBy = post.likedBy.filter(likedUser => likedUser.id !== user.id);
      await this.postRepository.save(post);

      res.json({ message: 'Post unliked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error unliking post', error });
    }
  }
}