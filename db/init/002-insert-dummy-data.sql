INSERT INTO sales
  (id, sale_id, item_id, register_person_id, registered_at, is_created, create_person_id, created_at, is_handed_over, hand_over_person_id, handed_over_at, is_canceled, cancel_person_id, canceled_at)
VALUES
  (0, 0, 30, 18, "2024-11-23 10:15:10", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (1, 1, 41, 17, "2024-11-23 10:18:58", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 17, "2024-11-23 10:23:38"  ),
  (2, 2, 20, 13, "2024-11-23 10:21:27", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (3, 3, 10, 6, "2024-11-23 10:31:34", TRUE, 22, "2024-11-23 10:32:47", TRUE, 20, "2024-11-23 10:34:32", FALSE, NULL, NULL  ),
  (4, 4, 10, 2, "2024-11-23 11:06:52", TRUE, 20, "2024-11-23 11:10:57", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (5, 5, 31, 21, "2024-11-23 11:09:48", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (6, 6, 10, 16, "2024-11-23 11:22:18", TRUE, 9, "2024-11-23 11:27:34", TRUE, 17, "2024-11-23 11:31:55", FALSE, NULL, NULL  ),
  (7, 7, 30, 0, "2024-11-23 11:28:57", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 0, "2024-11-23 11:32:17"  ),
  (8, 8, 11, 13, "2024-11-23 12:22:56", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (9, 9, 10, 6, "2024-11-23 12:27:14", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 6, "2024-11-23 12:30:30"  ),
  (10, 9, 20, 23, "2024-11-23 12:29:33", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 23, "2024-11-23 12:33:03"  ),
  (11, 10, 10, 23, "2024-11-23 13:03:57", TRUE, 7, "2024-11-23 13:07:57", TRUE, 3, "2024-11-23 13:12:44", FALSE, NULL, NULL  ),
  (12, 11, 20, 0, "2024-11-23 13:08:45", TRUE, 14, "2024-11-23 13:10:41", TRUE, 1, "2024-11-23 13:11:09", FALSE, NULL, NULL  ),
  (13, 12, 10, 2, "2024-11-23 13:18:48", TRUE, 18, "2024-11-23 13:22:56", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (14, 13, 20, 10, "2024-11-23 15:04:26", TRUE, 11, "2024-11-23 15:07:28", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (15, 14, 11, 6, "2024-11-23 15:05:17", TRUE, 7, "2024-11-23 15:10:14", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (16, 15, 31, 17, "2024-11-23 15:11:01", TRUE, 20, "2024-11-23 15:16:03", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (17, 15, 31, 10, "2024-11-23 15:11:34", TRUE, 22, "2024-11-23 15:13:58", TRUE, 15, "2024-11-23 15:14:44", FALSE, NULL, NULL  ),
  (18, 16, 41, 13, "2024-11-23 15:19:12", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 13, "2024-11-23 15:23:33"  ),
  (19, 17, 31, 16, "2024-11-23 16:17:04", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (20, 18, 11, 3, "2024-11-23 16:18:39", TRUE, 10, "2024-11-23 16:20:36", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (21, 19, 11, 16, "2024-11-24 10:10:07", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 16, "2024-11-24 10:13:28"  ),
  (22, 19, 20, 12, "2024-11-24 10:21:35", TRUE, 15, "2024-11-24 10:24:55", TRUE, 9, "2024-11-24 10:29:45", FALSE, NULL, NULL  ),
  (23, 20, 10, 14, "2024-11-24 11:07:51", TRUE, 8, "2024-11-24 11:11:04", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (24, 21, 41, 22, "2024-11-24 11:20:26", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (25, 22, 30, 4, "2024-11-24 12:10:23", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (26, 23, 41, 8, "2024-11-24 12:10:50", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 8, "2024-11-24 12:12:08"  ),
  (27, 24, 41, 16, "2024-11-24 12:12:37", TRUE, 13, "2024-11-24 12:13:37", TRUE, 14, "2024-11-24 12:18:54", FALSE, NULL, NULL  ),
  (28, 25, 20, 12, "2024-11-24 12:15:24", TRUE, 15, "2024-11-24 12:18:49", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (29, 26, 31, 15, "2024-11-24 12:19:18", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (30, 27, 11, 21, "2024-11-24 13:18:08", TRUE, 12, "2024-11-24 13:23:46", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (31, 28, 10, 9, "2024-11-24 14:04:25", TRUE, 0, "2024-11-24 14:09:54", TRUE, 12, "2024-11-24 14:14:31", FALSE, NULL, NULL  ),
  (32, 29, 20, 7, "2024-11-24 14:13:55", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 7, "2024-11-24 14:16:31"  ),
  (33, 30, 20, 1, "2024-11-24 15:12:58", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 1, "2024-11-24 15:14:34"  ),
  (34, 31, 10, 15, "2024-11-24 15:31:29", FALSE, NULL, NULL, FALSE, NULL, NULL, TRUE, 15, "2024-11-24 15:34:54"  ),
  (35, 32, 11, 14, "2024-11-24 16:06:21", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (36, 33, 10, 10, "2024-11-24 16:08:50", FALSE, NULL, NULL, FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (37, 34, 20, 13, "2024-11-24 16:18:34", TRUE, 19, "2024-11-24 16:23:21", TRUE, 23, "2024-11-24 16:26:11", FALSE, NULL, NULL  ),
  (38, 35, 11, 11, "2024-11-24 16:28:20", TRUE, 6, "2024-11-24 16:32:05", FALSE, NULL, NULL, FALSE, NULL, NULL  ),
  (39, 36, 10, 17, "2024-11-24 16:28:39", TRUE, 16, "2024-11-24 16:33:23", TRUE, 9, "2024-11-24 16:38:14", FALSE, NULL, NULL  );
