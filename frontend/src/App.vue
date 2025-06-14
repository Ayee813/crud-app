<script setup lang="ts">
import { ref } from 'vue'
import Header from "./components/Header.vue"
import MainContent from "./components/MainContent.vue"
import addProductForm from './components/addProductForm.vue'

interface Product {
  id: number;
  name: string;
  description: string;
  weigh: number;
}

const showForm = ref(false);
const formMode = ref<'create' | 'edit' | 'delete'>('create');
const selectedProduct = ref<Product | null>(null);

const openForm = (mode: 'create' | 'edit' | 'delete' = 'create', product: Product | null = null) => {
  formMode.value = mode;
  selectedProduct.value = product;
  showForm.value = true;
}

const closeForm = () => {
  showForm.value = false;
  formMode.value = 'create';
  selectedProduct.value = null;
}

</script>

<template>
  <Header></Header>
  <MainContent @add-product="openForm" @edit-product="openForm"></MainContent>
  <addProductForm 
    v-if="showForm" 
    :mode="formMode" 
    :product="selectedProduct"
    @cancel="closeForm"
    @success="closeForm"
  ></addProductForm>
</template>

<style scoped>
</style>