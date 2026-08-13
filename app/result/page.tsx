"use client";

import React, { useState } from "react";
import { z } from "zod";

// 1. Zod Schema for Result Checker Validation
const resultCheckerSchema = z.object({
    examinationNumber: z
        .string()
        .length(10, { message: "Examination Number must be exactly 10 digits." })
        .regex(/^\d+$/, { message: "Examination Number must contain digits only." }),
    examType: z.enum(["MAY/JUN", "NOV/DEC"], {
        message: "Please select an examination type."
    }),
    examYear: z.string().min(4, { message: "Please select an examination year." }),
    cardPin: z
        .string()
        .min(10, { message: "PIN code is required." })
        .regex(/^\d+$/, { message: "PIN must contain digits only." }),
    cardSerial: z.string().min(5, { message: "Serial Number is required." }),
});

type ResultCheckerFormValues = z.infer<typeof resultCheckerSchema>;

export default function ResultPage() {
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const years = Array.from({ length: 2026 - 1991 + 1 }, (_, i) => (2026 - i).toString());

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const values = {
            examinationNumber: formData.get("ExamNumber") as string,
            examType: formData.get("ExamType") as string,
            examYear: formData.get("ExamYear") as string,
            cardPin: formData.get("pin") as string,
            cardSerial: formData.get("serial") as string,
        };

        const validated = resultCheckerSchema.safeParse(values);

        if (!validated.success) {
            e.preventDefault(); // Stop form submission if validation fails
            const fieldErrors: Record<string, string[]> = {};
            for (const issue of validated.error.issues) {
                const field = issue.path[0]?.toString();
                if (field) {
                    if (!fieldErrors[field]) fieldErrors[field] = [];
                    fieldErrors[field].push(issue.message);
                }
            }
            setErrors(fieldErrors);
        } else {
            setErrors({});
            // Form submits naturally to WAEC Direct in a new tab via target="_blank"
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                        CHECK YOUR WAEC RESULT
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Please fill in your examination and scratch card details accurately
                    </p>
                </div>

                {/* Form submitting directly to WAEC Direct in a new tab */}
                <form
                    action="https://www.waecdirect.org/DisplayResult.aspx"
                    method="POST"
                    target="_blank"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Examination Number */}
                    <div>
                        <label
                            htmlFor="examNumber"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Examination Number
                        </label>
                        <input
                            id="examNumber"
                            name="ExamNumber"
                            type="text"
                            maxLength={10}
                            required
                            placeholder="e.g. 4123456789"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.examinationNumber && (
                            <p className="mt-1 text-xs text-red-500">{errors.examinationNumber[0]}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Examination Type */}
                        <div>
                            <label
                                htmlFor="examType"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Examination Type
                            </label>
                            <select
                                id="examType"
                                name="ExamType"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="MAY/JUN">School Candidate (MAY/JUN)</option>
                                <option value="NOV/DEC">Private Candidate (NOV/DEC)</option>
                            </select>
                            {errors.examType && (
                                <p className="mt-1 text-xs text-red-500">{errors.examType[0]}</p>
                            )}
                        </div>

                        {/* Examination Year */}
                        <div>
                            <label
                                htmlFor="examYear"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Examination Year
                            </label>
                            <select
                                id="examYear"
                                name="ExamYear"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {errors.examYear && (
                                <p className="mt-1 text-xs text-red-500">{errors.examYear[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* PIN */}
                    <div>
                        <label
                            htmlFor="pin"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Card PIN
                        </label>
                        <input
                            id="pin"
                            name="pin"
                            type="text"
                            required
                            placeholder="Enter 12-digit PIN"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.cardPin && (
                            <p className="mt-1 text-xs text-red-500">{errors.cardPin[0]}</p>
                        )}
                    </div>

                    {/* Serial Number */}
                    <div>
                        <label
                            htmlFor="serialNumber"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Card Serial Number
                        </label>
                        <input
                            id="serialNumber"
                            name="serial"
                            type="text"
                            required
                            placeholder="e.g. WRN123456789"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {errors.cardSerial && (
                            <p className="mt-1 text-xs text-red-500">{errors.cardSerial[0]}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-emerald-600 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        CHECK MY RESULT
                    </button>
                </form>
            </div>
        </div>
    );
}