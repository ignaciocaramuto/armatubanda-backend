import { Collection, Entity, ManyToMany, PrimaryKey } from "@mikro-orm/core";
import { Musician } from "./musician.entity.js";
import { Band } from "./band.entity.js";
import { Advertisement } from "./advertisement.entity.js";

@Entity()
export class Genre {
  @PrimaryKey()
  name!: string;

  @ManyToMany(() => Musician, (musician) => musician.genres)
  musicians = new Collection<Musician>(this);

  @ManyToMany(() => Band, (band) => band.genres)
  bands = new Collection<Band>(this);

  @ManyToMany(() => Advertisement, (advertisement) => advertisement.genres)
  advertisements = new Collection<Advertisement>(this);
}
