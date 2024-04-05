import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { Experience } from "../enums/experience.enum.js";
import { Role } from "../enums/role.enum.js";
import { Genre } from "./genre.entity.js";
import { Instrument } from "./instrument.entity.js";
import { Post } from "./post.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Comment } from "./comment.entity.js";
import { Career } from "./career.entity.js";
import { Band } from "./band.entity.js";
import { Application } from "./application.entity.js";

@Entity()
export class Musician extends BaseEntity {
  @Property()
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Enum(() => Role)
  role!: Role;

  @Property()
  isProfileSet!: boolean;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ nullable: true })
  stageName?: string;

  @Property({ nullable: true })
  birthday?: Date;

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

  /*
    How to map the ManyToMany relation, in this case we want to load all instruments from a Musician.
    In a ManyToMany relation, there must be an owner.
  */
  @ManyToMany(() => Instrument, (instrument) => instrument.musicians, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  instruments = new Collection<Instrument>(this);

  @ManyToMany(() => Genre, (genre) => genre.musicians, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  genres = new Collection<Genre>(this);

  @Enum({ items: () => Experience, nullable: true })
  experience?: Experience;

  @OneToMany(() => Career, (career) => career.musician, {
    cascade: [Cascade.ALL],
    nullable: true,
  })
  career = new Collection<Comment>(this);

  @ManyToMany(() => Band, (band) => band.members)
  bands = new Collection<Band>(this);

  @OneToMany(() => Band, (band) => band.leader, {
    cascade: [Cascade.ALL],
  })
  ledBands = new Collection<Band>(this);

  @Property({ nullable: true })
  bio?: string;

  @Property({ nullable: true })
  lookingBands?: boolean;

  @Property({ nullable: true })
  imagePath!: string;

  @OneToMany(() => Comment, (comment) => comment.musician, {
    cascade: [Cascade.ALL],
  })
  comments = new Collection<Comment>(this);

  @OneToMany(() => Comment, (comment) => comment.author, {
    cascade: [Cascade.ALL],
  })
  writtenComments = new Collection<Comment>(this);

  @OneToMany(() => Post, (post) => post.musician, {
    cascade: [Cascade.ALL],
  })
  posts = new Collection<Post>(this);

  @OneToMany(() => Application, (application) => application.applicant, {
    cascade: [Cascade.ALL],
  })
  applications = new Collection<Application>(this);
}
