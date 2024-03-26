import { Entity, Property, OneToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Musician } from "./musician.entity.js";
import { Band } from "./band.entity.js";

@Entity()
export class Image extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  type!: string;

  @Property({ type: "longblob" })
  data!: Buffer;

  @OneToOne(() => Musician, (musician) => musician.image)
  musician!: Rel<Musician>;

  @OneToOne(() => Band, (band) => band.image)
  band!: Rel<Band>;
}
