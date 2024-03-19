import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Musician } from "./musician.entity.js";

@Entity()
export class Genre extends BaseEntity {
  @Property()
  name!: string;

  @ManyToMany(() => Musician, (musician) => musician.genres)
  musicians = new Collection<Musician>(this);
}
