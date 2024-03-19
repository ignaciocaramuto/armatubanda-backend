import { Entity, Property, ManyToOne, OneToOne, Rel } from "@mikro-orm/core";
import { Musician } from "./musician.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Comment extends BaseEntity {
  @Property()
  comment!: string;

  @ManyToOne(() => Musician, { nullable: false })
  musician!: Rel<Musician>;

  // Consultar
  @OneToOne(() => Musician, { nullable: false })
  commentator!: Rel<Musician>;
}
