<!-- HomeView.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Header -->
    <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {{ t('appName') }}
            </h1>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-3">
            <!-- Language Toggle -->
            <button
              @click="toggleLocale"
              class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
              :class="locale === 'fa' ? 'font-vazir' : ''"
            >
              {{ locale === 'en' ? 'فارسی' : 'English' }}
            </button>

            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              :aria-label="t('toggleTheme')"
            >
              <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Upload Section -->
      <div class="mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <!-- File Upload Area -->
          <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            class="relative"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
              id="file-upload"
            />
            
            <label
              for="file-upload"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all"
              :class="[
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-900/50'
              ]"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">{{ t('uploadPrompt') }}</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('supportedFormats') }}</p>
              </div>
            </label>

            <!-- Selected File Info -->
            <div v-if="selectedFile" class="mt-4 flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <button @click="clearFile" class="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Template Selection -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {{ t('selectTemplate') }}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                v-for="template in templates"
                :key="template.id"
                @click="selectedTemplate = template.id"
                class="group relative p-6 rounded-xl border-2 transition-all text-left"
                :class="[
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                ]"
              >
                <div class="flex items-start gap-3">
                  <div class="p-2 rounded-lg bg-gradient-to-br" :class="template.iconClass">
                    mponent :is="template.icon" class="w-6 h-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {{ t(`templates.${template.id}.name`) }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ template.sizes.length }} {{ t('sizes') }}
                    </p>
                  </div>
                </div>
                
                <!-- Checkmark -->
                <div
                  v-if="selectedTemplate === template.id"
                  class="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Custom Template Builder -->
          <div v-if="selectedTemplate === 'custom'" class="mt-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t('customSizes') }}</h4>
            
            <div class="space-y-3">
              <div v-for="(size, index) in customSizes" :key="index" class="flex items-center gap-3">
                <input
                  v-model.number="size.width"
                  type="number"
                  :placeholder="t('width')"
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <span class="text-gray-400">×</span>
                <input
                  v-model.number="size.height"
                  type="number"
                  :placeholder="t('height')"
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <input
                  v-model.number="size.count"
                  type="number"
                  min="1"
                  :placeholder="t('count')"
                  class="w-20 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <button
                  @click="removeCustomSize(index)"
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              @click="addCustomSize"
              class="mt-4 w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              + {{ t('addSize') }}
            </button>
          </div>

          <!-- Options -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <input v-model="options.enhance" type="checkbox" class="w-5 h-5 text-blue-600 rounded" />
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('enhanceQuality') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('enhanceQualityDesc') }}</p>
              </div>
            </label>

            <label class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <input v-model="options.includeZip" type="checkbox" class="w-5 h-5 text-blue-600 rounded" />
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('createZip') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('createZipDesc') }}</p>
              </div>
            </label>

            <label class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <input v-model="generateIco" type="checkbox" class="w-5 h-5 text-blue-600 rounded" />
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('generateIco') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('generateIcoDesc') }}</p>
              </div>
            </label>
          </div>

          <!-- Generate Button -->
          <button
            @click="generateImages"
            :disabled="!selectedFile || isProcessing"
            class="mt-6 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg v-if="!isProcessing" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <svg v-else class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? t('processing') : t('generateImages') }}
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="progress" class="mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t(`stages.${progress.stage}`) }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ progress.current }}/{{ progress.total }}
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 rounded-full"
              :style="{ width: `${(progress.current / progress.total) * 100}%` }"
            ></div>
          </div>
          <p v-if="progress.filename" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {{ progress.filename }}
          </p>
        </div>
      </div>

      <!-- Results Grid -->
      <div v-if="processedImages.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ t('results') }}
          </h3>
          <button
            @click="downloadAll"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {{ t('downloadAll') }}
          </button>
        </div>

        <!-- Image Grid with Placeholders -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="(img, index) in processedImages"
            :key="index"
            class="group relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
          >
            <!-- Placeholder Skeleton -->
            <div v-if="!img.loaded" class="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>

            <!-- Image -->
            <img
              :src="img.url"
              :alt="`${img.width}x${img.height}`"
              @load="img.loaded = true"
              class="w-full h-full object-contain transition-opacity duration-300"
              :class="img.loaded ? 'opacity-100' : 'opacity-0'"
            />

            <!-- Overlay Info -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p class="text-white text-xs font-semibold">{{ img.width }}×{{ img.height }}</p>
              <p class="text-white/70 text-xs">{{ formatFileSize(img.blob.size) }}</p>
              
              <button
                @click="downloadImage(img)"
                class="mt-2 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ t('download') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMediaProcessor } from '@/composables/mediaProcessor';
import type { ProcessedImage, ProgressEvent } from '@/composables/types';

// Icons as components
const PhoneIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`
};

const PlayIcon = {
  template: `<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>`
};

const DesktopIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
};

const PencilIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>`
};

// Localization
const locale = ref<'en' | 'fa'>('en');
const translations = {
  en: {
    appName: 'Image Resizer Pro',
    uploadPrompt: 'Click to upload or drag and drop',
    supportedFormats: 'PNG, JPG, WebP up to 50MB',
    selectTemplate: 'Choose a Template',
    customSizes: 'Custom Sizes',
    width: 'Width',
    height: 'Height',
    count: 'Count',
    addSize: 'Add Size',
    sizes: 'sizes',
    enhanceQuality: 'Enhance Quality',
    enhanceQualityDesc: 'Apply sharpening filter',
    createZip: 'Create ZIP',
    createZipDesc: 'Bundle all outputs',
    generateIco: 'Generate .ico',
    generateIcoDesc: 'Windows icon format',
    generateImages: 'Generate Images',
    processing: 'Processing...',
    results: 'Generated Images',
    downloadAll: 'Download All',
    download: 'Download',
    toggleTheme: 'Toggle theme',
    templates: {
      pwa: { name: 'PWA Icons' },
      android: { name: 'Android Icons' },
      youtube: { name: 'YouTube Thumbnails' },
      custom: { name: 'Custom Sizes' }
    },
    stages: {
      loading: 'Loading image...',
      processing: 'Processing images...',
      encoding: 'Encoding formats...',
      zipping: 'Creating archive...',
      complete: 'Complete!'
    }
  },
  fa: {
    appName: 'تغییر اندازه تصاویر',
    uploadPrompt: 'برای آپلود کلیک کنید یا فایل را بکشید',
    supportedFormats: 'PNG، JPG، WebP تا ۵۰ مگابایت',
    selectTemplate: 'انتخاب الگو',
    customSizes: 'اندازه‌های سفارشی',
    width: 'عرض',
    height: 'ارتفاع',
    count: 'تعداد',
    addSize: 'افزودن اندازه',
    sizes: 'اندازه',
    enhanceQuality: 'بهبود کیفیت',
    enhanceQualityDesc: 'اعمال فیلتر وضوح',
    createZip: 'ایجاد فایل فشرده',
    createZipDesc: 'بسته‌بندی همه خروجی‌ها',
    generateIco: 'ایجاد .ico',
    generateIcoDesc: 'فرمت آیکون ویندوز',
    generateImages: 'تولید تصاویر',
    processing: 'در حال پردازش...',
    results: 'تصاویر تولید شده',
    downloadAll: 'دانلود همه',
    download: 'دانلود',
    toggleTheme: 'تغییر پوسته',
    templates: {
      pwa: { name: 'آیکون‌های PWA' },
      android: { name: 'آیکون‌های اندروید' },
      youtube: { name: 'تامبنیل یوتیوب' },
      custom: { name: 'اندازه سفارشی' }
    },
    stages: {
      loading: 'بارگذاری تصویر...',
      processing: 'پردازش تصاویر...',
      encoding: 'رمزگذاری فرمت‌ها...',
      zipping: 'ایجاد آرشیو...',
      complete: 'تکمیل شد!'
    }
  }
};

const t = (key: string) => {
  const keys = key.split('.');
  let value: any = translations[locale.value];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
};

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'fa' : 'en';
  document.documentElement.dir = locale.value === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.lang = locale.value;
};

// Dark mode
const isDark = ref(false);
const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark.value) document.documentElement.classList.add('dark');
});

// Templates
const templates = [
  {
    id: 'pwa',
    icon: PhoneIcon,
    iconClass: 'from-blue-500 to-cyan-500',
    sizes: [
      { width: 72, height: 72 },
      { width: 96, height: 96 },
      { width: 128, height: 128 },
      { width: 144, height: 144 },
      { width: 152, height: 152 },
      { width: 192, height: 192 },
      { width: 384, height: 384 },
      { width: 512, height: 512 }
    ]
  },
  {
    id: 'android',
    icon: PlayIcon,
    iconClass: 'from-green-500 to-emerald-500',
    sizes: [
      { width: 36, height: 36 },
      { width: 48, height: 48 },
      { width: 72, height: 72 },
      { width: 96, height: 96 },
      { width: 144, height: 144 },
      { width: 192, height: 192 },
      { width: 512, height: 512 }
    ]
  },
  {
    id: 'youtube',
    icon: DesktopIcon,
    iconClass: 'from-red-500 to-pink-500',
    sizes: [
      { width: 1280, height: 720 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 }
    ]
  },
  {
    id: 'custom',
    icon: PencilIcon,
    iconClass: 'from-purple-500 to-indigo-500',
    sizes: []
  }
];

const selectedTemplate = ref('pwa');
const customSizes = ref([{ width: 512, height: 512, count: 1 }]);

const addCustomSize = () => {
  customSizes.value.push({ width: 512, height: 512, count: 1 });
};

const removeCustomSize = (index: number) => {
  customSizes.value.splice(index, 1);
};

// File handling
const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    selectedFile.value = target.files[0];
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files.length) {
    selectedFile.value = e.dataTransfer.files[0];
  }
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

// Processing
const { processImage, downloadFile, downloadAll: downloadAllHelper, isProcessing, progress } = useMediaProcessor();

const options = ref({
  enhance: true,
  includeZip: true,
  quality: 0.95
});

const generateIco = ref(false);
const processedImages = ref<Array<ProcessedImage & { url: string; loaded: boolean }>>([]);

const getCurrentSizes = () => {
  if (selectedTemplate.value === 'custom') {
    return customSizes.value;
  }
  return templates.find(t => t.id === selectedTemplate.value)?.sizes || [];
};

const generateImages = async () => {
  if (!selectedFile.value) return;

  processedImages.value = [];

  try {
    const result = await processImage(selectedFile.value, {
      sizes: getCurrentSizes(),
      format: generateIco.value ? 'ico' : 'png',
      quality: options.value.quality,
      enhance: options.value.enhance,
      includeZip: options.value.includeZip,
      concurrency: 6
    });

    processedImages.value = result.images.map(img => ({
      ...img,
      url: URL.createObjectURL(img.blob),
      loaded: false
    }));
  } catch (err) {
    console.error('Processing failed:', err);
  }
};

const downloadImage = (img: ProcessedImage) => {
  downloadFile(img.blob, img.filename);
};

const downloadAll = () => {
  if (processedImages.value.length === 0) return;
  
  // If we have processed result, download it
  processedImages.value.forEach(img => {
    downloadFile(img.blob, img.filename);
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');

.font-vazir {
  font-family: 'Vazirmatn', sans-serif;
}

[dir="rtl"] {
  font-family: 'Vazirmatn', sans-serif;
}
</style>
