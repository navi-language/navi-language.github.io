<template>
    <div class="max-w-3xl mx-auto">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <h1>
                    <a
                        href="/pkg/"
                        class="text-black no-underline dark:text-white"
                        >Pkgs</a
                    >
                </h1>
            </div>
            <form action="" method="GET">
                <input
                    type="text"
                    name="q"
                    placeholder="Search ..."
                    v-model="q"
                    class="search-input"
                />
            </form>
        </div>
        <div class="pkgs">
            <template v-if="loading">
                <div class="animate-pulse">
                    <div class="pkg-item">
                        <div class="pkg-name">
                            <div class="flex items-end space-x-3">
                                <div
                                    class="w-48 h-6 bg-gray-200 rounded dark:bg-stone-800"
                                ></div>
                                <div
                                    class="w-12 h-4 bg-gray-200 rounded dark:bg-stone-800"
                                ></div>
                            </div>
                            <div
                                class="w-12 h-4 bg-gray-200 rounded dark:bg-stone-800"
                            ></div>
                        </div>
                        <div
                            class="w-full h-4 bg-gray-200 rounded dark:bg-stone-800"
                        ></div>
                    </div>
                </div>
                <div class="animate-pulse">
                    <div class="pkg-item">
                        <div class="pkg-name">
                            <div class="flex items-end space-x-3">
                                <div
                                    class="w-64 h-6 bg-gray-200 rounded dark:bg-stone-800"
                                ></div>
                                <div
                                    class="w-12 h-4 bg-gray-200 rounded dark:bg-stone-800"
                                ></div>
                            </div>
                            <div
                                class="w-12 h-4 bg-gray-200 rounded dark:bg-stone-800"
                            ></div>
                        </div>
                        <div
                            class="w-3/5 h-4 bg-gray-200 rounded dark:bg-stone-800"
                        ></div>
                    </div>
                </div>
            </template>
            <tempalte v-if="!loading">
                <template v-if="pkgs.length === 0">
                    <div class="pkg-item">No packages found.</div>
                </template>
                <div v-else v-for="pkg in pkgs" :key="pkg.id" class="pkg-item">
                    <div class="pkg-name">
                        <div class="flex items-end space-x-3">
                            <a
                                class="pkg-name-text"
                                :href="`https://github.com/orgs/navi-language/packages/npm/package/${pkg.name}`"
                                target="_blank"
                                >{{ pkg.name }}</a
                            >
                            <div class="pkg-version">{{ pkg.version }}</div>
                        </div>
                        <a :href="pkg.repository" target="_blank">Source</a>
                    </div>
                    <div class="pkg-description">{{ pkg.description }}</div>
                    <div></div>
                </div>
            </tempalte>
        </div>
        <div class="pkg-pagination">
            <template v-if="offset <= 0">
                <span class="page-link" disabled>Previus</span>
            </template>
            <template v-else>
                <a class="page-link" :href="`?offset=${offset - pageSize}`"
                    >Previus</a
                >
            </template>
            <template v-if="pkgs.length < pageSize">
                <span class="page-link" disabled>Next</span>
            </template>
            <template v-else>
                <a :href="`?offset=${offset + pageSize}`" class="page-link"
                    >Next</a
                >
            </template>
        </div>
        <div class="mt-10">
            All packages are hosted on
            <a
                href="https://github.com/orgs/navi-language/packages/"
                target="_blank"
                >GitHub Packages</a
            >.
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";

let q = "";
const pageSize = 10;
let offset = 0;

if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search);
    offset = parseInt(query.get("offset") || "0");

    q = query.get("q") || "";
}

const loading = ref(true);

const pkgs = ref<
    {
        name: string;
        version: string;
        description?: string;
        repository?: string;
    }[]
>([]);

const fetchPkgs = async () => {
    let searcher = supabase.from("pkgs").select("*");

    if (q) {
        searcher = searcher.ilike("name", `%${q}%`);
    }

    const { data, error } = await searcher
        .order("name")
        .range(offset, offset + pageSize);
    if (error) {
        console.error(error);
    } else {
        pkgs.value = data;
    }
    loading.value = false;
};

onMounted(fetchPkgs);
</script>

<style scoped type="scss">
.pkgs {
    @apply space-y-3 my-10 min-h-10 sm:min-h-[300px];
}
.pkg-item {
    @apply px-4 py-4 overflow-hidden bg-white border border-gray-200 sm:rounded-md sm:px-6 text-sm;
    @apply dark:bg-stone-950 dark:border-stone-800;
    @apply hover:shadow transition-shadow duration-300 ease-in-out;

    a {
        @apply text-gray-500 dark:text-gray-400;
    }

    .pkg-name {
        @apply flex items-center justify-between mb-3;

        .pkg-name-text {
            @apply text-xl font-medium text-blue-500;
        }
        .pkg-version {
            @apply text-sm font-medium text-gray-500;
        }
    }

    .pkg-description {
        @apply text-sm text-ellipsis overflow-hidden;
    }
}

.pkg-pagination {
    @apply flex justify-between mt-5;

    .page-link {
        @apply text-blue-500 no-underline px-4 py-1 rounded-md border border-blue-500;

        &[disabled] {
            @apply text-gray-300 border-gray-300 dark:text-stone-700 dark:border-stone-700 cursor-default;
        }
    }
}

.search-input {
    @apply w-48 px-5 py-1 border border-solid border-gray-300 rounded-2xl dark:border-stone-800;
}
</style>
