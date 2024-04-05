import {
  Entity,
  Property,
  DateTimeType,
  Enum,
  ManyToOne,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Status } from "../enums/status.enum.js";
import { Advertisement } from "./advertisement.entity.js";
import { Musician } from "./musician.entity.js";

@Entity()
export class Application extends BaseEntity {
  @Property()
  message!: string;

  @Property({ type: DateTimeType })
  createdAt? = new Date();

  @Enum(() => Status)
  status!: Status;

  @ManyToOne(() => Advertisement)
  advertisement!: Rel<Advertisement>;

  @ManyToOne(() => Musician)
  applicant!: Rel<Musician>;
}
