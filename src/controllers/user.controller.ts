import { Request, Response } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await this.userRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  async followUser(req: Request, res: Response) {
  try {
    const currentUser = req.user!;
    const userToFollowId = parseInt(req.params.id);
    
    if (currentUser.id === userToFollowId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    
    const userToFollow = await this.userRepository.findOne({
      where: { id: userToFollowId },
      relations: ['followers']
    });
    
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const alreadyFollowing = userToFollow.followers.some(
      follower => follower.id === currentUser.id
    );
    
    if (alreadyFollowing) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    userToFollow.followers.push(currentUser);
    await this.userRepository.save(userToFollow);
    
    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error });
  }
}

async unfollowUser(req: Request, res: Response) {
  try {
    const currentUser = req.user!;
    const userToUnfollowId = parseInt(req.params.id);
    
    const userToUnfollow = await this.userRepository.findOne({
      where: { id: userToUnfollowId },
      relations: ['followers']
    });
    
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const following = userToUnfollow.followers.some(
      follower => follower.id === currentUser.id
    );
    
    if (!following) {
      return res.status(400).json({ message: 'Not following this user' });
    }
    
    userToUnfollow.followers = userToUnfollow.followers.filter(
      follower => follower.id !== currentUser.id
    );
    await this.userRepository.save(userToUnfollow);
    
    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
}
}
