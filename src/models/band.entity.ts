import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from "@mikro-orm/core";
import { Genre } from "./genre.entity.js";
import { Post } from "./post.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Comment } from "./comment.entity.js";
import { Musician } from "./musician.entity.js";
import { Advertisement } from "./advertisement.entity.js";

@Entity()
export class Band extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  description!: string;

  @Property()
  country!: string;

  @Property()
  state!: string;

  @Property()
  city!: string;

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

  @ManyToOne(() => Musician)
  leader!: Rel<Musician>;

  @Property({ nullable: true })
  lookingMusicians?: boolean;

  @Property({ nullable: true })
  imagePath!: string;

  @OneToMany(() => Comment, (comment) => comment.band, {
    cascade: [Cascade.ALL],
  })
  comments = new Collection<Comment>(this);

  @OneToMany(() => Post, (post) => post.band, {
    cascade: [Cascade.ALL],
  })
  posts = new Collection<Post>(this);

  @OneToMany(() => Advertisement, (advertisement) => advertisement.band, {
    cascade: [Cascade.ALL],
  })
  advertisements = new Collection<Advertisement>(this);
}
