<script lang="ts" setup>
import { reactive, watch } from 'vue'
import axios from "axios"

interface Product {
  id: number;
  name: string;
  description: string;
  weigh: number;
}

const props = defineProps<{
    mode: 'create' | 'edit' | 'delete',
    product?: Product | null
}>()

const emit = defineEmits(['cancel', 'success'])
const api = "http://localhost:3000/products"

const cancel = () => {
    emit('cancel')
}

const productInfo = reactive({
    name: "",
    description: "",
    weigh: ""
});

// Watch for product changes to populate form
watch(() => props.product, (product) => {
    if (product) {
        productInfo.name = product.name;
        productInfo.description = product.description;
        productInfo.weigh = String(product.weigh);
    } else {
        // Reset form for create mode
        productInfo.name = '';
        productInfo.description = '';
        productInfo.weigh = '';
    }
}, { immediate: true });

const handleSubmit = async () => {
    try {
        if (props.mode === 'create') {
            await axios.post(api, {
                name: productInfo.name,
                description: productInfo.description,
                weigh: Number(productInfo.weigh),
            });
            console.log("Product created successfully");
        } else if (props.mode === 'edit' && props.product) {
            await axios.put(`${api}/${props.product.id}`, {
                name: productInfo.name,
                description: productInfo.description,
                weigh: productInfo.weigh,
            });
            console.log("Product updated successfully");
        } else if (props.mode === 'delete' && props.product) {
            await axios.delete(`${api}/${props.product.id}`);
            console.log("Product deleted successfully");
        }
        
        // Reset form
        productInfo.name = '';
        productInfo.description = '';
        productInfo.weigh = '';
        
        emit('success');
    } catch (err) {
        console.error("Error:", err);
    }
};

</script>

<template>
    <div class="add-product-container">
        <form @submit.prevent="handleSubmit">
            <!-- Title -->
            <h2 v-if="props.mode === 'create'">Add New Product</h2>
            <h2 v-else-if="props.mode === 'edit'">Edit Product</h2>
            <h2 v-else-if="props.mode === 'delete'">Delete Product</h2>
            
            <!-- Form Fields -->
            <fieldset>
                <label for="name">Name</label>
                <input 
                    type="text" 
                    id="name" 
                    v-model="productInfo.name"
                    :disabled="props.mode === 'delete'"
                    required
                >
                
                <label for="description">Description</label>
                <input 
                    type="text" 
                    id="description" 
                    v-model="productInfo.description"
                    :disabled="props.mode === 'delete'"
                    required
                >
                
                <label for="weigh">Weight</label>
                <input 
                    type="number" 
                    id="weigh" 
                    v-model="productInfo.weigh"
                    :disabled="props.mode === 'delete'"
                    required
                    min="0"
                    step="0.01"
                >
            </fieldset>
            
            <div class="option">
                <button type="button" @click="cancel">Cancel</button>

                <button v-if="props.mode === 'create'" style="background-color: blue; color: white;" type="submit">
                    Create
                </button>

                <button v-else-if="props.mode === 'edit'" style="background-color: green; color: white;" type="submit">
                    Save
                </button>

                <button v-else-if="props.mode === 'delete'" style="background-color: red; color: white;" type="submit">
                    Delete
                </button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.add-product-container {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    transition: .3s;

    & form {
        width: 600px;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 20px;
        background-color: rgb(219, 219, 219);
        border-radius: 30px;
        animation: formStart .2s ease-in-out;

        & fieldset {
            border: none;
            padding: 30px;
            display: flex;
            flex-direction: column;
            gap: 10px;

            & input {
                padding: 5px;
                border: 10px;
                width: 300px;
                height: 35px;
                border-radius: 3px;
            }

            & #weigh::-webkit-outer-spin-button,
            #weigh::-webkit-inner-spin-button {
                -webkit-appearance: none;
                padding: 0;
            }
        }

        & button {
            border: none;
            padding: 10px;
            width: 120px;
            margin: 0px 10px;
            border-radius: 10px;
        }
    }
}

@keyframes formStart {
    from {
        transform: scale(0) translateY(200px);
    }

    to {
        transform: scale(1) translateY(0);
    }
}
</style>
