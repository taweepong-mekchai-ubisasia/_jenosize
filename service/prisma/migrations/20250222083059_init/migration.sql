-- CreateTable
CREATE TABLE `tb_sys_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NULL,
    `username` VARCHAR(125) NULL,
    `password` VARCHAR(125) NULL,
    `firstname` VARCHAR(125) NULL,
    `lastname` VARCHAR(125) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(125) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(125) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(125) NULL,

    UNIQUE INDEX `tb_sys_user_id_key`(`id`),
    UNIQUE INDEX `tb_sys_user_code_key`(`code`),
    UNIQUE INDEX `tb_sys_user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_email_campaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NULL,
    `campaign` VARCHAR(125) NULL,
    `subject` VARCHAR(125) NULL,
    `contents` VARCHAR(125) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(125) NULL,
    `updated_at` DATETIME(3) NULL,
    `updated_by` VARCHAR(125) NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted_by` VARCHAR(125) NULL,

    UNIQUE INDEX `tb_email_campaign_id_key`(`id`),
    UNIQUE INDEX `tb_email_campaign_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
