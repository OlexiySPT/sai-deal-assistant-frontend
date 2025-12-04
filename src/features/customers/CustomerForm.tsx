import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createCustomer,
  updateCustomer,
  fetchCustomerById,
  clearCurrentCustomer,
  selectCurrentCustomer,
  selectCustomersLoading,
  selectCustomersError,
} from "./customersSlice";
import type {
  CreateSampleCustomerRequest,
  UpdateSampleCustomerRequest,
} from "../../types";

export const CustomerForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentCustomer = useAppSelector(selectCurrentCustomer);
  const loading = useAppSelector(selectCustomersLoading);
  const error = useAppSelector(selectCustomersError);
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateSampleCustomerRequest>({
    code: "",
    name: "",
    postalCode: "",
    addressLn1: "",
    addressLn2: "",
    country: "",
    phone: "",
    email: "",
    taxNumber: "",
    vatPayerNumber: "",
    socialSecurityPayerNumber: "",
    taxPayerScheme: "",
    registrationDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCustomerById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentCustomer());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (currentCustomer && isEditMode) {
      setFormData({
        code: currentCustomer.code || "",
        name: currentCustomer.name || "",
        postalCode: "",
        addressLn1: "",
        addressLn2: "",
        country: currentCustomer.country || "",
        phone: currentCustomer.phone || "",
        email: currentCustomer.email || "",
        taxNumber: currentCustomer.taxNumber || "",
        vatPayerNumber: currentCustomer.vatPayerNumber || "",
        socialSecurityPayerNumber:
          currentCustomer.socialSecurityPayerNumber || "",
        taxPayerScheme: currentCustomer.taxPayerScheme || "",
        registrationDate: currentCustomer.registrationDate
          ? currentCustomer.registrationDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [currentCustomer, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && id) {
        const updateData: UpdateSampleCustomerRequest = { ...formData };
        await dispatch(
          updateCustomer({ id: Number(id), data: updateData })
        ).unwrap();
      } else {
        await dispatch(createCustomer(formData)).unwrap();
      }
      navigate("/customers");
    } catch (err) {
      console.error("Failed to save customer:", err);
    }
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {isEditMode ? "Edit Customer" : "Create Customer"}
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Code *
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code || ""}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="addressLn1"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Address Line 1
            </label>
            <input
              type="text"
              id="addressLn1"
              name="addressLn1"
              value={formData.addressLn1 || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="addressLn2"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLn2"
              name="addressLn2"
              value={formData.addressLn2 || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="taxNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tax Number
            </label>
            <input
              type="text"
              id="taxNumber"
              name="taxNumber"
              value={formData.taxNumber || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="vatPayerNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              VAT Payer Number
            </label>
            <input
              type="text"
              id="vatPayerNumber"
              name="vatPayerNumber"
              value={formData.vatPayerNumber || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="socialSecurityPayerNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Social Security Payer Number
            </label>
            <input
              type="text"
              id="socialSecurityPayerNumber"
              name="socialSecurityPayerNumber"
              value={formData.socialSecurityPayerNumber || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="taxPayerScheme"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tax Payer Scheme
            </label>
            <input
              type="text"
              id="taxPayerScheme"
              name="taxPayerScheme"
              value={formData.taxPayerScheme || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="registrationDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Registration Date *
            </label>
            <input
              type="date"
              id="registrationDate"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};
