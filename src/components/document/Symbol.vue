<template>
  <div class="navi-document">
    <Breadcumb :channel="prefix" :breadcumbs="breadcumbs" />
    <div class="navi-symbol">
      <div class="symbol-summary" open>
        <div class="symbol-name">
          <h1 :id="name">{{ name }}</h1>
          <pre class="_nv_code" v-html="typeSign" />
        </div>
        <Doc :doc="symbol.doc" />
      </div>

      <section class="symbol-fields" v-if="symbol.fields.length > 0">
        <div class="doc-section-title" id="fields">Fields</div>
        <template v-for="field in symbol.fields" :key="field.name">
          <details class="field-symbol">
            <summary>
              <div class="field-name">
                <a :href="`#${name}`" class="heading-anchor fn-anchor">#</a>
                <div class="flex items-center justify-between flex1">
                  <pre class="_nv_code" v-html="codeGenerator.genField(field)" />
                </div>
              </div>
              <Doc :doc="field.doc" summary />
            </summary>
            <Doc :doc="field.doc" />
          </details>
        </template>
      </section>

      <section class="symbol-items" v-if="symbol.items.length > 0">
        <div class="doc-section-title" id="items">Enum Items</div>
        <ul>
          <template v-for="item in symbol.items" :key="item.name">
            <li :id="item.name">
              <div>
                <a :href="`#${item.name}`">{{ item.name }}</a>
              </div>
              <Doc :doc="item.doc" />
            </li>
          </template>
        </ul>
      </section>

      <section class="symbol-impls" v-if="symbol.implementions.length > 0">
        <div class="doc-section-title" id="implementions">Implementions</div>
        <div class="_nv_code" v-html="codeGenerator.genImplementations(symbol.implementions)" />
      </section>

      <section class="symbol-methods" v-if="operators.length > 0">
        <div class="doc-section-title" id="methods">Operators</div>
        <template v-for="method in operators" :key="method.name">
          <Function :name="method.name" :symbol="method" :level="2" />
        </template>
      </section>

      <section class="symbol-methods" v-if="staticMethods.length > 0">
        <div class="doc-section-title" id="methods">Static Methods</div>
        <template v-for="method in staticMethods" :key="method.name">
          <Function :name="method.name" :symbol="method" :level="2" />
        </template>
      </section>

      <section class="symbol-methods" v-if="methods.length > 0">
        <div class="doc-section-title" id="methods">Methods</div>
        <template v-for="method in methods" :key="method.name">
          <Function :name="method.name" :symbol="method" :level="2" />
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TypeSymbol } from '../../types';
import Breadcumb from './Breadcumb.vue';
import Doc from './Doc.vue';
import Function from './Function.vue';
import { codeGenerator } from './code-generator';

import './style.scss';

const props = defineProps<{
  prefix: 'stdlib' | 'pkg';
  name: string;
  module: string;
  symbol: TypeSymbol;
}>();

const breadcumbs: {
  name: string;
  href?: string;
}[] = [{ name: props.name }];
if (props.module) {
  breadcumbs.unshift({
    name: props.module,
    href: `/${props.prefix}/${props.module}`,
  });
}

const typeSign = codeGenerator.genType(props.name, props.symbol);
const staticMethods = props.symbol.methods.filter((m) => !m.name.startsWith('_') && !m.name.startsWith('operator ') && (m.arguments.length == 0 || m.arguments[0].type != 'self'));
const methods = props.symbol.methods.filter((m) => !m.name.startsWith('_') && !m.name.startsWith('operator ') && m.arguments.length > 0 && m.arguments[0].type == 'self');
const operators = props.symbol.methods.filter((m) => m.name.startsWith('operator '));

staticMethods.sort((a, b) => a.name.localeCompare(b.name));
methods.sort((a, b) => a.name.localeCompare(b.name));
</script>

<style type="scss" scoped>
.navi-symbol {
  .symbol-summary {
    @apply mb-10;
  }

  .symbol-name {
    @apply border-b border-gray-200 border-dashed pb-2 mb-5;

    &::before {
      top: 19px;
    }

    h1 {
      @apply p-0 m-0 border-none text-gray-800 mb-3;
      @apply dark:text-gray-200;
    }

    .symbol-kind {
      @apply text-base text-gray-500;
      @apply dark:text-gray-400;
    }

    &:hover {
      .heading-anchor {
        @apply block;
      }
    }

    pre {
      @apply whitespace-break-spaces outline-none;
    }
  }

  .symbol-methods {
    summary {
      @apply text-gray-600 font-bold cursor-pointer;
    }
  }
}

.field-symbol {
  summary {
    &::before {
      top: 4px;
    }
  }

  .field-name {
    @apply flex items-center;

    h3 {
      @apply p-0 m-0 border-none text-gray-800;
      @apply dark:text-gray-200;
    }

    .token-value-type {
      @apply ml-1;

      &::before {
        content: ': ';
      }
    }
  }
}
</style>
