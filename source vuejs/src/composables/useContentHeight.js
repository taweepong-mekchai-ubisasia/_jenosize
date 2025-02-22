import { ref, computed, onMounted, onUnmounted, watch } from "vue";

export function useContentHeight(AppLayoutComponent, titleZone) {
  const navbarHeight = computed(() => {
    return AppLayoutComponent.value ? AppLayoutComponent.value.navbarHeight : 0;
  });

  const breadcrumbsHeight = computed(() => {
    return AppLayoutComponent.value
      ? AppLayoutComponent.value.breadcrumbsHeight
      : 0;
  });

  const viewportHeight = ref(window.innerHeight);
  const viewportWidth = ref(window.innerWidth);

  const contentHeight = computed(() => {
    const navbar = parseInt(navbarHeight.value);
    const breadcrumbs = parseInt(breadcrumbsHeight.value);

    const titleZoneHeight = titleZone.value ? titleZone.value.offsetHeight : 0;
    let marginAdjustment;

    if (viewportWidth.value <= 640) {
      marginAdjustment = "3rem";
    } else if (viewportWidth.value <= 768) {
      marginAdjustment = "4rem";
    } else {
      marginAdjustment = "4.5rem";
    }
    return `calc(${viewportHeight.value}px - ${navbar}px - ${breadcrumbs}px - ${titleZoneHeight}px - 6rem - ${marginAdjustment})`;
  });

  const handleResize = () => {
    viewportHeight.value = window.innerHeight;
    viewportWidth.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  watch([navbarHeight, breadcrumbsHeight, titleZone], () => {}, {
    immediate: true,
  });

  return { contentHeight };
}
