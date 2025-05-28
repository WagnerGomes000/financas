<?php
session_start();
session_destroy();
?>
<script>
    // Limpar dados do usuário do localStorage
    localStorage.clear();
    window.location.href = 'login.php';
</script>
