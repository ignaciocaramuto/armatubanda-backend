import { Entity, Property, ManyToOne, OneToOne, Rel } from "@mikro-orm/core";
import { Musician } from "./musician.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Comment extends BaseEntity {
  @Property()
  comment!: string;

  @ManyToOne(() => Musician, { nullable: true })
  musician!: Rel<Musician>;

  // Same for band

  @ManyToOne(() => Musician, { nullable: false })
  author!: Rel<Musician>;
}
