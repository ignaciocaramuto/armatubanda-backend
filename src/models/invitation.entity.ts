import { Entity, ManyToOne, Rel, Enum } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Status } from "../enums/status.enum.js";
import { Band } from "./band.entity.js";
import { Musician } from "./musician.entity.js";

@Entity()
export class Invitation extends BaseEntity {
  @Enum(() => Status)
  status!: Status;

  @ManyToOne(() => Band)
  band!: Rel<Band>;

  @ManyToOne(() => Musician)
  musician!: Rel<Musician>;
}
