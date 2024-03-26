import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { Genre } from "./genre.entity.js";
import { Image } from "./image.entity.js";
import { Post } from "./post.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Comment } from "./comment.entity.js";
import { Musician } from "./musician.entity.js";

@Entity()
export class Band extends BaseEntity {
  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  country?: string;

  @Property({ nullable: true })
  state?: string;

  @Property({ nullable: true })
  city?: string;

  @Property({ nullable: true })
  phoneNumber?: string;

  @Property({ nullable: true })
  webSite?: string;

  @Property({ nullable: true })
  socialMedia?: string;

  @ManyToMany(() => Genre, (genre) => genre.bands, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  genres = new Collection<Genre>(this);

  @ManyToMany(() => Musician, (musician) => musician.bands, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  members = new Collection<Musician>(this);

  @Property({ nullable: true })
  lookingMusicians?: boolean;

  @OneToOne(() => Image, (image) => image.band, {
    owner: true,
    nullable: true,
  })
  image?: Image;

  @OneToMany(() => Comment, (comment) => comment.band, {
    cascade: [Cascade.ALL],
  })
  comments = new Collection<Comment>(this);

  @OneToMany(() => Post, (post) => post.band, {
    cascade: [Cascade.ALL],
  })
  posts = new Collection<Post>(this);
}
