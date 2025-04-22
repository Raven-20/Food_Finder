export async function getRecipeById(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
      if (!response.ok) throw new Error("Recipe not found");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  