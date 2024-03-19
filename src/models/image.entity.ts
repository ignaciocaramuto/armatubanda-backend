import { BlobType, Entity, Property, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Musician } from "./musician.entity.js";

@Entity()
export class Image extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  type!: string;

  @Property()
  byte!: BlobType[];

  @OneToOne(() => Musician, (musician) => musician.image)
  musician!: Musician;
}
