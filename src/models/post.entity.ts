import { Entity } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/base-entity.entity.js";

@Entity()
export class Post extends BaseEntity {
  // Cascade
  //@OneToOne()
  //@Join
}
