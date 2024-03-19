import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Genre extends BaseEntity {
  @Property()
  name!: string;
}
