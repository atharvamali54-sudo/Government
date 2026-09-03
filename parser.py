import pyshark
import scapy.all as scapy

def parse_pcap_file(file_path: str):
    """
    Parses IPsec/IKE packets from a PCAP/PCAPNG file using PyShark.
    """
    cap = pyshark.FileCapture(file_path, display_filter="ike or esp or ah")
    
    ike_proposals = []
    esp_packet_count = 0
    modes_detected = set()
    
    for packet in cap:
        try:
            # Check for IKEv1 / IKEv2 security associations and transforms
            if hasattr(packet, 'ike'):
                ike_proposals.append({
                    "packet_num": packet.number,
                    "source": packet.ip.src if hasattr(packet, 'ip') else "IPv6",
                    "destination": packet.ip.dst if hasattr(packet, 'ip') else "IPv6",
                    "details": str(packet.ike)
                })
            
            # Check for ESP traffic (Transport vs Tunnel mode heuristics)
            if hasattr(packet, 'esp'):
                esp_packet_count += 1
                # Heuristic: Check IP header nesting to infer Tunnel mode
                if hasattr(packet, 'ipv6') and packet.ipv6.get_field('ipv6.next_hdr') == '50':
                    modes_detected.add("Tunnel Mode")
                elif hasattr(packet, 'ip') and packet.ip.proto == '50':
                    modes_detected.add("Tunnel Mode")
                else:
                    modes_detected.add("Transport Mode")
        except Exception as e:
            continue
            
    cap.close()
    
    return {
        "ike_exchanges": len(ike_proposals),
        "esp_packets": esp_packet_count,
        "inferred_modes": list(modes_detected) or ["Tunnel Mode"]
    }
  
