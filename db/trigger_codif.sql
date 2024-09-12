-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trgr_p20esp() RETURNS TRIGGER
AS
$$
BEGIN
	IF NEW.estado = 'CODIFICADO' THEN
		UPDATE estructuras.inicial1_capitulo_emigracion
		SET p202esp_cod = NEW.codigocodif
		WHERE id_p20esp = NEW.id_p20esp;
	ELSIF NEW.estado = 'VERIFICADO' THEN
		UPDATE estructuras.inicial1_capitulo_emigracion
		SET p202esp_cod = NEW.codigocodif_v1
		WHERE id_p20esp = NEW.id_p20esp;
	ELSIF NEW.estado = 'VERIFICADO_JT' THEN
		UPDATE estructuras.inicial1_capitulo_emigracion
		SET p202esp_cod = NEW.codigocodif_v2
		WHERE sec_cuestionario = NEW.sec_cuestionario  AND  i00 = NEW.i00   AND   i001a = NEW.i001a  AND  p20nro=NEW.p20nro;
	END IF;
	RETURN NEW;
END;
$$
LANGUAGE plpgsql;
CREATE TRIGGER trgr_p20esp
AFTER UPDATE ON codificacion.cod_p20esp
FOR EACH ROW
EXECUTE FUNCTION trgr_p20esp();