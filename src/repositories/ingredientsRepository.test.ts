import { beforeEach, describe, expect, it } from "vitest";
import * as ingredientsRepository from "./ingredientsRepository";

beforeEach(() => {
  localStorage.clear();
});

describe("ingredientsRepository", () => {
  it("creates an ingredient with a generated id and timestamps", () => {
    const created = ingredientsRepository.create({
      name: "Farinha de amendoa",
      packagePrice: 25,
      packageQuantity: 500,
      unit: "g",
    });

    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBe(created.updatedAt);
    expect(ingredientsRepository.getAll()).toHaveLength(1);
  });

  it("reads an ingredient by id", () => {
    const created = ingredientsRepository.create({
      name: "Eritritol",
      packagePrice: 18,
      packageQuantity: 1,
      unit: "kg",
    });

    expect(ingredientsRepository.getById(created.id)).toEqual(created);
    expect(ingredientsRepository.getById("does-not-exist")).toBeNull();
  });

  it("updates only the provided fields and bumps updatedAt", async () => {
    const created = ingredientsRepository.create({
      name: "Ovos",
      packagePrice: 15,
      packageQuantity: 30,
      unit: "unidade",
    });

    await new Promise((resolve) => setTimeout(resolve, 5));
    const updated = ingredientsRepository.update(created.id, { packagePrice: 16 });

    expect(updated?.packagePrice).toBe(16);
    expect(updated?.name).toBe("Ovos");
    expect(updated?.updatedAt).not.toBe(created.updatedAt);
  });

  it("returns null when updating an ingredient that does not exist", () => {
    expect(ingredientsRepository.update("missing", { packagePrice: 1 })).toBeNull();
  });

  it("removes an ingredient", () => {
    const created = ingredientsRepository.create({
      name: "Leite de coco",
      packagePrice: 8,
      packageQuantity: 500,
      unit: "ml",
    });

    ingredientsRepository.remove(created.id);

    expect(ingredientsRepository.getAll()).toHaveLength(0);
    expect(ingredientsRepository.getById(created.id)).toBeNull();
  });
});
