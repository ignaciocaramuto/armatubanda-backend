import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Musician } from "./musician.entity.js";
import { Advertisement } from "./advertisement.entity.js";

@Entity()
export class Instrument extends BaseEntity {
  @Property()
  name!: string;

  @ManyToMany(() => Musician, (musician) => musician.instruments)
  musicians = new Collection<Musician>(this);

  @ManyToMany(() => Advertisement, (advertisement) => advertisement.instruments)
  advertisements = new Collection<Advertisement>(this);
}
