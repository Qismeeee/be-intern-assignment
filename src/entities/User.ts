import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable
} from 'typeorm';
import { Post } from './Post';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToMany('Post', 'user') 
  posts: Post[];

  @ManyToMany('User', 'following')
  @JoinTable({
    name: "follows",
    joinColumn: { name: "followerId" },
    inverseJoinColumn: { name: "followingId" }
  })
  followers: User[];

  @ManyToMany('User', 'followers')
  following: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}