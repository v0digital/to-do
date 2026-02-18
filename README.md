# To-Do SaaS Platform | v0 Digital

Uma plataforma profissional de gestão de tarefas e produtividade de alta performance, construída com **Next.js 16+**, **Prisma ORM**, **MySQL** e **Tailwind CSS v4**.

---

## 🚀 Tecnologias Core

* **Framework:** [Next.js 16+](https://nextjs.org) (App Router)
* **Database:** MySQL via [Prisma ORM](https://www.prisma.io/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Standard v4 @latest)
* **Auth:** NextAuth.js com estratégia JWT
* **E-mail:** Resend API para notificações e verificação
* **Linguagem:** TypeScript

---

## 🛠️ Configuração do Ambiente

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1.  **Instalação de Dependências:**
    ```bash
    npm install
    ```

2.  **Configuração do Banco de Dados:**
    Certifique-se de que o seu MySQL está ativo e configure o ficheiro `.env` na raiz do projeto:
    ```env
    DATABASE_URL="mysql://root:748013@localhost:3306/todo_db"
    RESEND_API_KEY="re_aLarNXSh_43Kk2Aom76avKsQoSiGzwDyZ"
    JWT_SECRET="SsK6HZ4+6jfGSHZYZt/3gECKHZfGSOY+0Grv2u9WZCA="
    NEXTAUTH_URL="http://localhost:3000"
    ```

3.  **Migração do Prisma:**
    Para criar as tabelas no MySQL Workbench automaticamente:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Execução do Servidor:**
    ```bash
    npm run dev
    ```

---

## 🎨 Padrões de Design (v0 Digital)

A interface segue um layout minimalista e responsivo, utilizando as classes oficiais do Tailwind v4:

* **Modo Light:**
    * Fundo: `bg-white`
    * Títulos: `text-gray-800` | Subtítulos: `text-gray-500` | Texto: `text-gray-400`
    * Bordas: `border-gray-200`
    * Botões: `bg-gray-800` (hover: `bg-gray-950`)

* **Modo Dark:**
    * Fundo: `bg-gray-950`
    * Títulos: `text-gray-50` | Subtítulos: `text-gray-100` | Texto: `text-gray-200`
    * Bordas: `border-gray-800`
    * Botões: `bg-gray-50` (hover: `bg-gray-200`)

* **Regras:** Sem gradientes `bg-gradient-to`, apenas `bg-linear-to-br`. Sem utilização de colchetes `-[]` nas classNames.

---

## 📂 Estrutura de Dados

* **User:** Gestão de utilizadores, autenticação e verificação de e-mail.
* **Task:** Gestão de tarefas com controlo de `timeSpent`, `status` e `estimatedTime`.
* **Notification:** Sistema de alertas (info, warning, success, error) associado a utilizadores e tarefas.

---

## 🛡️ Segurança e Rotas

Este projeto utiliza o padrão **NextJS 16+** onde o `Middleware` foi substituído pelo sistema de **`src/proxy.ts`** para gestão de segurança e redirecionamentos.

---
© 2026 **v0 Digital** - Desenvolvimento Profissional.