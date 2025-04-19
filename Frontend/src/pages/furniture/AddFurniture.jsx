import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { handleError, handleSuccess } from '../../utils/authSwal'; 
import { useForm } from 'react-hook-form';
import { useAddFurnitureMutation } from '../../redux/features/furnitures/furnituresApi';

const AddFurniture = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const image_hosting_key = import.meta.env.VITE_IMG_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
    const [addFurniture, { isLoading: isAdding }] = useAddFurnitureMutation();
    const user = useSelector((state) => state.auth.user);
    
    const onSubmit = async (data) => {
        try {
            const imageFile = data.image[0];
            let Image; 
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const response = await fetch(image_hosting_api, { method: 'POST', body: formData });
                const result = await response.json();
                if (result.success) {
                    Image = result.data.display_url;
                } else {
                    handleError('Failed to upload image.');
                    return;
                }
            }
    
            const furnitureData = { 
                title: data.title,  
                description: data.description,
                ...(Image && { Image }),
                price: data.price,
                stock: data.stock,
            };
            await addFurniture(furnitureData).unwrap();
            handleSuccess('Furniture Added Successfully!');
            navigate('/furniture');
        } catch (error) {
            console.log(error);
            handleError('Failed to upload', error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="">
                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Add New Furniture</h1>
                        <p className="text-indigo-100">Fill in the details below to add a new furniture item</p>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        {/* Title Field */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                {...register("title", { required: "Title is required" })}
                                id="title"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter furniture title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                {...register("description", { required: "Description is required" })}
                                id="description"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter detailed description"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Furniture Image
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                                    </div>
                                    <input 
                                        {...register("image")}
                                        id="image" 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Price and Stock Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price Field */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        {...register("price", { 
                                            required: "Price is required",
                                            min: { value: 0, message: "Price must be positive" }
                                        })}
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                )}
                            </div>

                            {/* Stock Field */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Quantity
                                </label>
                                <input
                                    {...register("stock", { 
                                        required: "Stock quantity is required",
                                        min: { value: 0, message: "Stock cannot be negative" }
                                    })}
                                    id="stock"
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter quantity"
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isAdding}
                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isAdding ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isAdding ? 'Adding...' : 'Add Furniture'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddFurniture;