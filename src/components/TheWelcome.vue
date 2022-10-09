<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
</script>

<template>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Painel</template>

    Link de projeção do 
    <a href="/painel">Painel/TV</a>. deste modulo do Atlantis.
    <br>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Gestão</template>

    Pagina de gestão do painel:
    <br>
    <br>
    Pagina dos <a href="/gestor">Usuários</a>, pagina para chamar as senhas.

  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Suporte</template>

    Para suporte contate o desenvolvedor ou abra um issue no <a href="https://github.com/vdiogov/Atlantis" target="_blank" rel="noopener">Github</a> do projeto.
  </WelcomeItem>
</template>
