import { BlobType, Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Image extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  type!: string;

  @Property()
  byte!: BlobType[];
}
