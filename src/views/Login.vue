<template>
    <div>
        <auth-form :isLogin="true"></auth-form>
    </div>
</template>

<script>
import AuthForm from "@/components/AuthForm.vue"

export default {
    components : {AuthForm},
    name:"Login",
}
</script>

