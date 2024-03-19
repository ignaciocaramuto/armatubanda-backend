import {
  Entity,
  Property,
  Cascade,
  OneToOne,
  Collection,
} from "@mikro-orm/core";
import { Musician } from "./musician.entity.js";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Comment extends BaseEntity {
  @Property()
  comment!: string;

  // Cascade: como se debe comportar a la hora de actualizar/borrar
  @OneToOne(() => Musician, (musician) => musician.id, {
    cascade: [Cascade.ALL],
  })
  commentatorId = new Collection<Musician>(this);
}
