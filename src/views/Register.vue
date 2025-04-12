<template>
    <div>
        <auth-form :isLogin="false"></auth-form>
    </div>
</template>

<script>
import AuthForm from "@/components/AuthForm.vue"

export default {
    components : {AuthForm},
    name:"Register",
}
</script>

