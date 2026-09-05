"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { z } from "zod";

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
      <Card className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-4">
        <CardHeader className="mb-2 text-center">
          <CardTitle className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            CHECK YOUR WAEC RESULT
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please fill in your examination and scratch card details accurately
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Form submitting directly to WAEC Direct in a new tab */}
          <form
            action="https://www.waecdirect.org/DisplayResult.aspx"
            method="POST"
            target="_blank"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Examination Number */}
            <div className="space-y-1">
              <Label htmlFor="examNumber" className="text-gray-700 dark:text-gray-300">
                Examination Number
              </Label>
              <Input
                id="examNumber"
                name="ExamNumber"
                type="text"
                maxLength={10}
                required
                placeholder="e.g. 4123456789"
                className="font-mono py-2.5 focus-visible:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {errors.examinationNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.examinationNumber[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Examination Type */}
              <div className="space-y-1">
                <Label htmlFor="examType" className="text-gray-700 dark:text-gray-300">
                  Examination Type
                </Label>
                <Select name="ExamType" required defaultValue="MAY/JUN">
                  <SelectTrigger 
                    id="examType"
                    className="w-full py-2.5 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAY/JUN">School Candidate (MAY/JUN)</SelectItem>
                    <SelectItem value="NOV/DEC">Private Candidate (NOV/DEC)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.examType && (
                  <p className="mt-1 text-xs text-red-500">{errors.examType[0]}</p>
                )}
              </div>

              {/* Examination Year */}
              <div className="space-y-1">
                <Label htmlFor="examYear" className="text-gray-700 dark:text-gray-300">
                  Examination Year
                </Label>
                <Select name="ExamYear" required defaultValue={years[0]}>
                  <SelectTrigger 
                    id="examYear"
                    className="w-full py-2.5 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.examYear && (
                  <p className="mt-1 text-xs text-red-500">{errors.examYear[0]}</p>
                )}
              </div>
            </div>

            {/* PIN */}
            <div className="space-y-1">
              <Label htmlFor="pin" className="text-gray-700 dark:text-gray-300">
                Card PIN
              </Label>
              <Input
                id="pin"
                name="pin"
                type="text"
                required
                placeholder="Enter 12-digit PIN"
                className="font-mono py-2.5 focus-visible:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {errors.cardPin && (
                <p className="mt-1 text-xs text-red-500">{errors.cardPin[0]}</p>
              )}
            </div>

            {/* Serial Number */}
            <div className="space-y-1">
              <Label htmlFor="serialNumber" className="text-gray-700 dark:text-gray-300">
                Card Serial Number
              </Label>
              <Input
                id="serialNumber"
                name="serial"
                type="text"
                required
                placeholder="e.g. WRN123456789"
                className="font-mono py-2.5 focus-visible:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {errors.cardSerial && (
                <p className="mt-1 text-xs text-red-500">{errors.cardSerial[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 py-6 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              CHECK MY RESULT
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
 

    );
}