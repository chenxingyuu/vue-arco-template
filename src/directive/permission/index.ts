import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { permissions } = userStore;
  if (Array.isArray(value)) {
    if (value.length > 0) {
      const hasPermission = value.some((requiredPermission) =>
        permissions.some(
          (userPermission) =>
            userPermission === requiredPermission ||
            requiredPermission.startsWith(`${userPermission}`)
        )
      );

      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(
      `need permissions! Like v-permission="['system:user:read', 'system:user:update']"`
    );
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
