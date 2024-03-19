import axios from "axios";


export const getAnimals = async () => {
  const { data } = await axios.get("http://localhost:8080/animal/find-all");
  return data;
};

export const deleteAnimal = async (id) => {
  const { data } = await axios.delete(
    `http://localhost:8080/animal/delete/${id}`
  );
  return data;
};

export const createAnimal = async (animal) => {
  const { data } = await axios.post(
    `http://localhost:8080/animal/save`,
    animal
  );
  return data;
};


export const updateAnimalFunction = async (animal) => {
  const { data } = await axios.put(
    `http://localhost:8080/animal/update/${animal.animalId}`,
    animal
  );
  return data;
};
