import {
  DateTimeType,
  Entity,
  ManyToOne,
  Property,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Musician } from "./musician.entity.js";

@Entity()
export class Post extends BaseEntity {
  @Property()
  videoUrl!: string;

  @Property({ type: DateTimeType })
  createdAt? = new Date();

  @ManyToOne(() => Musician, { nullable: false })
  musician!: Rel<Musician>;
}
