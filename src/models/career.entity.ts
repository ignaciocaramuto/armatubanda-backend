import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { Musician } from "./musician.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Career extends BaseEntity {
  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;

  @ManyToOne(() => Musician, { nullable: false })
  musician!: Rel<Musician>;
}
