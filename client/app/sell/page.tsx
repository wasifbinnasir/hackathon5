'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCarMutation, useCreateAuctionMutation } from '@/lib/apis';
import PageHeader from '../components/PageHeader';
import { useRouter } from 'next/navigation';

const bodyTypes = ["sedan", "sports", "hatchback", "convertible", "suv", "coupe", "truck", "wagon", "van"];
const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"];
const driveTypes = ["FWD", "RWD", "AWD", "4WD"];
const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
const accidentHistoryOptions = ["No accidents", "Minor accident", "Major accident", "Multiple accidents"];
const serviceHistoryOptions = ["Full service history", "Partial service history", "No service history"];
const ownershipOptions = ["First owner", "Second owner", "Third owner", "Multiple owners"];
const importStatusOptions = ["Local", "Imported", "Grey import"];

export default function SellPage() {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [createCar, { isLoading: creatingCar, error: carError }] = useCreateCarMutation();
  const [createAuction, { isLoading: creatingAuction, error: auctionError }] = useCreateAuctionMutation();

  // Upload image to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tea_store');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/drygxmmvj/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImage(data.secure_url);
    } catch (err) {
      console.error('Cloudinary upload failed', err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData: any) => {
    if (!image) {
      alert('Please upload at least one image');
      return;
    }

    try {
      // Create car first
      const newCar = await createCar({
        ...formData,
        images: [image],
      }).unwrap();

      // Create auction for that car
      await createAuction({
        carId: newCar._id,
        startTime: formData.startTime,
        endTime: formData.endTime,
        startingPrice: Number(formData.startingPrice),
      }).unwrap();

      alert('Car and Auction created!');
      reset();        // Reset form fields
      setImage(null); // Reset uploaded image
      router.push('/auctions'); // Redirect to auctions page
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <PageHeader title="Sell Your Car" />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h1 className="text-xl font-semibold text-purple-900 mb-2">Sell Your Car</h1>
          <p className="text-sm text-purple-700">
            Fill out your car details, upload photos, and set auction details. Dealers will bid and you’ll get the best price.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Car Details */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                Title
                <input className="border rounded px-3 py-2 w-full" {...register("title", { required: "Title is required" })} />
              </label>

              <label>
                Make
                <input className="border rounded px-3 py-2 w-full" {...register("make", { required: "Make is required" })} />
              </label>

              <label>
                Model
                <input className="border rounded px-3 py-2 w-full" {...register("carModel", { required: "Model is required" })} />
              </label>

              <label>
                Year
                <input type="number" className="border rounded px-3 py-2 w-full" {...register("year", { required: true, valueAsNumber: true })} />
              </label>

              <label>
                Price
                <input type="number" className="border rounded px-3 py-2 w-full" {...register("price", { required: true, valueAsNumber: true })} />
              </label>

              <label>
                VIN
                <input className="border rounded px-3 py-2 w-full" {...register("vin", { required: true })} />
              </label>

              <label>
                Mileage (km)
                <input type="number" className="border rounded px-3 py-2 w-full" {...register("mileage", { required: true, valueAsNumber: true })} />
              </label>

              <label>
                Engine
                <input className="border rounded px-3 py-2 w-full" {...register("engine", { required: true })} />
              </label>

              <label>
                Transmission
                <select className="border rounded px-3 py-2 w-full" {...register("transmission", { required: true })}>
                  <option value="">Select Transmission</option>
                  {transmissionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label>
                Drive Type
                <select className="border rounded px-3 py-2 w-full" {...register("driveType", { required: true })}>
                  <option value="">Select Drive</option>
                  {driveTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label>
                Fuel Type
                <select className="border rounded px-3 py-2 w-full" {...register("fuelType", { required: true })}>
                  <option value="">Select Fuel</option>
                  {fuelTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label>
                Body Type
                <select className="border rounded px-3 py-2 w-full" {...register("bodyType", { required: true })}>
                  <option value="">Select Body Type</option>
                  {bodyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>

              <label>
                Accident History
                <select className="border rounded px-3 py-2 w-full" {...register("accidentHistory")}>
                  <option value="">Select</option>
                  {accidentHistoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>

              <label>
                Service History
                <select className="border rounded px-3 py-2 w-full" {...register("serviceHistory")}>
                  <option value="">Select</option>
                  {serviceHistoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>

              <label>
                Ownership History
                <select className="border rounded px-3 py-2 w-full" {...register("ownershipHistory")}>
                  <option value="">Select</option>
                  {ownershipOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>

              <label>
                Import Status
                <select className="border rounded px-3 py-2 w-full" {...register("importStatus")}>
                  <option value="">Select</option>
                  {importStatusOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Upload */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Upload Photos</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="border rounded px-3 py-2 w-full"/>
            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            {image && (
              <img src={image} alt="Car" className="mt-4 w-48 h-32 object-cover rounded border" />
            )}
          </div>

          {/* Auction */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Auction Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                Start Time
                <input type="datetime-local" className="border rounded px-3 py-2 w-full" {...register("startTime", { required: true })} />
              </label>
              <label>
                End Time
                <input type="datetime-local" className="border rounded px-3 py-2 w-full" {...register("endTime", { required: true })} />
              </label>
              <label className="col-span-2">
                Starting Price
                <input type="number" className="border rounded px-3 py-2 w-full" {...register("startingPrice", { required: true, valueAsNumber: true })} />
              </label>
            </div>
          </div>

          {(carError || auctionError) && <p className="text-red-600 text-sm">Failed to submit</p>}

          <div className="flex justify-center pt-6">
            <button disabled={creatingCar || creatingAuction || uploading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-12 py-3 text-lg font-semibold rounded-md transition-colors duration-200">
              {creatingCar || creatingAuction || uploading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
