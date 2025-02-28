<template>
  <div class="navi-document">
    <Breadcumb :channel="prefix" :breadcumbs="[{ name: name }]" />

    <div class="navi-module">
      <h1>{{ name }}</h1>
      <Doc :doc="module.doc" default="" />

      <template v-if="hasTypes">
        <div class="navi-types">
          <div id="types" class="doc-section-title">Types</div>

          <div>
            <template v-for="(symbol, name) in module.symbols" :key="name">
              <template v-if="symbol.kind === 'type'">
                <pre class="_nv_code" v-html="codeGenerator.genType(name, symbol)" />
              </template>
            </template>
          </div>
        </div>
      </template>

      <section class="navi-consts" v-if="hasConsts">
        <div class="doc-section-title" id="consts">Global Variables</div>
        <template v-for="(symbol, name) in module.symbols" :key="name">
          <template v-if="symbol.kind === 'global_var'">
            <div class="navi-const">
              <pre class="_nv_code" v-html="codeGenerator.genGlobalVar(name, symbol)" />

              <Doc :doc="symbol.doc" />
            </div>
          </template>
        </template>
      </section>

      <section class="navi-fns" v-if="hasFunctions">
        <div class="doc-section-title" id="fn">Functions</div>

        <template v-for="(symbol, name) in module.symbols" :key="name">
          <template v-if="symbol.kind === 'function' && !name.startsWith('_')">
            <Function :name="name" :symbol="symbol" :level="2" />
          </template>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Module } from '../../types';
import Breadcumb from './Breadcumb.vue';
import Doc from './Doc.vue';
import Function from './Function.vue';
import { codeGenerator } from './code-generator';

import './style.scss';

const props = defineProps<{
  prefix: 'stdlib' | 'pkg';
  name: string;
  module: Module;
}>();

const hasFunctions = Object.entries(props.module.symbols).some(
  ([name, symbol]) => symbol.kind === 'function' && !name.startsWith('_')
);
const hasTypes = Object.entries(props.module.symbols).some(
  ([_, symbol]) => symbol.kind === 'type'
);
const hasConsts = Object.entries(props.module.symbols).some(
  ([_, symbol]) => symbol.kind === 'global_var'
);
</script>

<style type="scss" scoped>
.navi-types {
  ul {
    li {
      list-style: square;
    }
  }
}

.navi-const {
  @apply mb-8;
}
</style>
