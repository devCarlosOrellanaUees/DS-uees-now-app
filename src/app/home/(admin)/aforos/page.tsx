import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'

export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Aforos" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full">
                    <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                        Aforos
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio harum itaque maiores soluta tenetur accusantium blanditiis excepturi at repellendus nemo consequuntur, assumenda deleniti nobis eum amet quo nisi. Cupiditate, eligendi?
                    </p>
                </div>
            </div>
        </div>
    )
}
