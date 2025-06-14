<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";

interface Product {
  id: number;
  name: string;
  description: string;
  weigh: number;
}

const api = "http://localhost:3000/products";
const data = ref<Product[]>([]);

const fetchData = async () => {
  try {
    const response = await axios.get(api);
    data.value = response.data;
    console.log(data.value);
  } catch (error) {
    console.log("error fetching data:", { error });
  }
};

const emit = defineEmits(["add-product", "edit-product"]);

const handleAddClick = () => {
  emit("add-product", 'create');
};

const handleEditClick = (product: Product) => {
  emit("edit-product", 'edit', product);
};

const handleDeleteClick = async (product: Product) => {
  try {
    await axios.delete(`${api}/${product.id}`);
    console.log("Product deleted successfully");
    fetchData(); // Refresh the list after deletion
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

// Refresh data when operations complete
const refreshData = () => {
  fetchData();
};

onMounted(() => {
  fetchData();
});

// Listen for form completion to refresh data
defineExpose({ refreshData });
</script>

<template>
  <section>
    <div class="title-wrapper">
      <h2>Product list</h2>
      <button @click="handleAddClick">+ Add product</button>
    </div>

    <div class="product-container">
      <table border="1">
        <thead>
          <tr>
            <th style="width: 10px">No</th>
            <th>Name</th>
            <th>Description</th>
            <th>Weight</th>
            <th style="width: 300px">Option</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.weigh }} KG</td>
            <td style="text-align: center">
              <button class="edit" @click="handleEditClick(item)">Edit</button> | 
              <button class="del" @click="handleDeleteClick(item)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  margin-top: 50px;
  width: 100%;
  height: 540px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & .title-wrapper {
    width: 60%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    & button {
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      background-color: blue;
      color: white;
    }
  }

  & .product-container {
    width: 80%;
    height: 430px;
    display: flex;
    justify-content: center;
    align-items: start;

    & table {
      border-collapse: collapse;
      width: 80%;

      & th {
        text-align: center;
        padding: 8px;
      }

      & td {
        padding: 8px;
        text-align: left;

        & .edit {
          border: none;
          padding: 10px 30px;
          background-color: blue;
          color: white;
          border-radius: 6px;
          cursor: pointer;
        }

        & .del {
          border: none;
          padding: 10px 30px;
          background-color: red;
          color: white;
          border-radius: 6px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>