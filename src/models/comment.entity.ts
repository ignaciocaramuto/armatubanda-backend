import { Entity, Property, ManyToOne, OneToOne, Rel } from "@mikro-orm/core";
import { Musician } from "./musician.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Band } from "./band.entity.js";

@Entity()
export class Comment extends BaseEntity {
  @Property()
  comment!: string;

  @ManyToOne(() => Musician, { nullable: true })
  musician?: Rel<Musician>;

  @ManyToOne(() => Band, { nullable: true })
  band?: Rel<Band>;

  @ManyToOne(() => Musician, { nullable: false })
  author!: Rel<Musician>;
}
