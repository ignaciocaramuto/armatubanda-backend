import { Entity, Property } from "@mikro-orm/core";
import { Experience } from "../enums/experience.enum.js";
import { Role } from "../enums/role.enum.js";
import { Genre } from "./genre.entity.js";
import { Instrument } from "./instrument.entity.js";
import { Image } from "./image.entity.js";
import { Post } from "./post.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Musician extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  role!: Role;

  @Property()
  isProfileSet?: boolean;

  @Property()
  isEmailConfirmed?: boolean;

  @Property()
  firstName!: string;

  @Property()
  lastname!: string;

  @Property()
  stageName!: string;

  @Property()
  birthday!: Date;

  @Property()
  country!: string;

  @Property()
  state!: string;

  @Property()
  city!: string;

  @Property()
  phoneNumber?: string;

  @Property()
  webSite?: string;

  @Property()
  socialMedia?: string;

  @Property()
  instruments!: Instrument[];

  @Property()
  genres!: Genre[];

  @Property()
  experience!: Experience;

  // @Property()
  // career?: Career[];

  @Property()
  bio?: string;

  @Property()
  lookingBands?: boolean;

  @Property()
  lookingMusician?: boolean;

  @Property()
  available?: boolean;

  @Property()
  image!: Image;

  @Property()
  comments?: Comment[];

  @Property()
  posts?: Post[];
}
