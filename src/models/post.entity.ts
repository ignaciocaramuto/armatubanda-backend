import { Entity, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Musician } from "./musician.entity.js";

@Entity()
export class Post extends BaseEntity {
  @ManyToOne(() => Musician, { nullable: false })
  musician!: Rel<Musician>;
}
