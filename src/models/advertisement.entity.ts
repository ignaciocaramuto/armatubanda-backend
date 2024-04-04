import {
  Entity,
  Property,
  DateTimeType,
  ManyToMany,
  Collection,
  Cascade,
  OneToMany,
  Rel,
  ManyToOne,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";
import { Genre } from "./genre.entity.js";
import { Instrument } from "./instrument.entity.js";
import { Application } from "./application.entity.js";
import { Band } from "./band.entity.js";

@Entity()
export class Advertisement extends BaseEntity {
  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property({ type: DateTimeType })
  createdAt? = new Date();

  @ManyToMany(() => Genre, (genre) => genre.advertisements, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  genres = new Collection<Genre>(this);

  @ManyToMany(() => Instrument, (instruments) => instruments.advertisements, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  instruments = new Collection<Instrument>(this);

  @OneToMany(() => Application, (application) => application.advertisement, {
    cascade: [Cascade.ALL],
  })
  applications = new Collection<Application>(this);

  @ManyToOne(() => Band)
  band!: Rel<Band>;
}
