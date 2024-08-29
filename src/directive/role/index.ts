import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

function checkRole(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { role } = userStore;

  if (Array.isArray(value)) {
    if (value.length > 0) {
      const hasRole = value.includes(role);
      if (!hasRole && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-role="['admin','user']"`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkRole(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkRole(el, binding);
  },
};
