/**
 * SIAR Core C-ABI Foreign Function Interface Header
 * Architecture: Part 05 - Developer Portal & SDK Hub
 * Domain: siar.irshad.org.in | docs.siar.irshad.org.in
 * License: Apache-2.0 OR MIT
 */

#ifndef SIAR_CORE_H
#define SIAR_CORE_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ==============================================================================
   Opaque Handles & Type Definitions
   ============================================================================== */

typedef struct SiarNodeHandle SiarNodeHandle;
typedef struct SiarPeerTicket SiarPeerTicket;
typedef struct SiarMessageEvent SiarMessageEvent;

typedef enum SiarTransportType {
    SIAR_TRANSPORT_BLE = 0x01,
    SIAR_TRANSPORT_WIFI_DIRECT = 0x02,
    SIAR_TRANSPORT_WIFI_AWARE = 0x03,
    SIAR_TRANSPORT_QUIC = 0x04,
    SIAR_TRANSPORT_DTN = 0x05
} SiarTransportType;

typedef enum SiarPriorityClass {
    SIAR_PRIORITY_BULK = 0x00,
    SIAR_PRIORITY_NORMAL = 0x01,
    SIAR_PRIORITY_EXPEDITED = 0x02,
    SIAR_PRIORITY_EMERGENCY_SOS = 0x03
} SiarPriorityClass;

typedef struct SiarConfig {
    const char* storage_path;
    uint32_t dtn_storage_quota_mb;
    bool enable_ble_mesh;
    bool enable_wifi_direct;
    bool enable_quic_fallback;
    uint16_t local_listen_port;
} SiarConfig;

typedef struct SiarNodeMetrics {
    uint32_t active_mesh_peers;
    uint32_t dtn_queued_bundles;
    uint64_t bytes_transmitted;
    uint64_t bytes_received;
    uint8_t current_mls_epoch;
} SiarNodeMetrics;

typedef void (*SiarMessageCallback)(
    const uint8_t* sender_pubkey_32,
    const uint8_t* payload,
    size_t payload_len,
    SiarTransportType transport,
    void* user_data
);

/* ==============================================================================
   Node Lifecycle & Management APIs
   ============================================================================== */

/**
 * Initialize a new SIAR embedded node instance.
 *
 * @param config Pointer to configuration struct.
 * @param out_handle Pointer to store the allocated node handle.
 * @return 0 on success, negative error code on failure.
 */
int32_t siar_node_init(const SiarConfig* config, SiarNodeHandle** out_handle);

/**
 * Register a callback for incoming decrypted messages.
 */
int32_t siar_node_register_message_listener(
    SiarNodeHandle* handle,
    SiarMessageCallback callback,
    void* user_data
);

/**
 * Get current 32-byte Ed25519 identity public key of this node.
 */
int32_t siar_node_get_identity(
    const SiarNodeHandle* handle,
    uint8_t out_pubkey_32[32]
);

/**
 * Query real-time node operational metrics.
 */
int32_t siar_node_get_metrics(
    const SiarNodeHandle* handle,
    SiarNodeMetrics* out_metrics
);

/**
 * Send an end-to-end encrypted message bundle.
 */
int32_t siar_node_send_message(
    SiarNodeHandle* handle,
    const uint8_t destination_pubkey_32[32],
    const uint8_t* payload_bytes,
    size_t payload_len,
    SiarPriorityClass priority
);

/**
 * Broadcast an unencrypted, authenticated emergency SOS message across all hops.
 */
int32_t siar_node_broadcast_emergency(
    SiarNodeHandle* handle,
    const char* emergency_text_utf8,
    double latitude,
    double longitude
);

/**
 * Advance OpenMLS Tree-KEM ratchet state (Self-Update commit).
 */
int32_t siar_node_advance_mls_epoch(SiarNodeHandle* handle);

/**
 * Cleanly shut down the node and release all allocated memory.
 */
void siar_node_destroy(SiarNodeHandle* handle);

#ifdef __cplusplus
}
#endif

#endif /* SIAR_CORE_H */
