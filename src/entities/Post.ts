import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany,
  JoinTable, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Hashtag } from './Hashtag';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @Column()
  userId: number;

  @ManyToMany(() => User)
  @JoinTable({ 
    name: "likes",
    joinColumn: { 
      name: "postId",
      referencedColumnName: "id" 
    },
    inverseJoinColumn: { 
      name: "userId",
      referencedColumnName: "id"
    }
  })
  likedBy: User[];

  @ManyToMany(() => Hashtag, hashtag => hashtag.posts)
  @JoinTable({
    name: "post_hashtags_hashtags",
    joinColumn: { 
      name: "postId",
      referencedColumnName: "id" 
    },
    inverseJoinColumn: { 
      name: "hashtagId",
      referencedColumnName: "id"
    }
  })
  hashtags: Hashtag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}